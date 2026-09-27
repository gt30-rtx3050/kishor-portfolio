import assert from "node:assert/strict";
import { test } from "node:test";
import { getOrbitCard, getOrbitCopy, getScrollProgress, ORBIT, smootherstep } from "../src/components/experience/orbit-math.ts";
import { experiences } from "../src/lib/experiences.ts";

const close = (actual, expected, tolerance = 1e-8) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

const transformValues = pose => [...pose.transform.matchAll(/(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)(?:px|deg|\))/g)].map(match => Number(match[1]));

test("the five requested roles and overlapping dates are preserved in order", () => {
  assert.deepEqual(experiences.map(({ company, role, years }) => [company, role, years]), [
    ["SB Web Technology", "Content Writer", "2018–2020"],
    ["KPO & Company", "Content Manager", "2020–2022"],
    ["Daraz [Alibaba Group]", "Content Lead/Digital Marketing", "2023–2024"],
    ["Himalayan Dream Treks [Remote]", "SEO Content Manager", "2023–2024"],
    ["AFC Urgent Care [Remote]", "Growth Marketing Manager", "2024–2026"],
  ]);
});

test("uses the published page overrides, not the component defaults", () => {
  assert.equal(ORBIT.rotation, 250);
  assert.equal(ORBIT.startOffset, 100);
  assert.equal(ORBIT.maxWidth, 852);
  assert.equal(ORBIT.aspect, 1.33);
  assert.equal(ORBIT.depthOpacity, 80);
  assert.equal(ORBIT.desktopBreakpoint, 800);
});

test("quintic smootherstep clamps and is symmetric", () => {
  assert.equal(smootherstep(0.2, 0.8, 0), 0);
  assert.equal(smootherstep(0.2, 0.8, 1), 1);
  close(smootherstep(0.2, 0.8, 0.5), 0.5);
  for (let x = 0; x <= 1; x += 0.01) close(smootherstep(0, 1, x) + smootherstep(0, 1, 1 - x), 1);
});

test("scroll mapping includes the original one-viewport entry lead", () => {
  assert.equal(getScrollProgress(900, 4140, 900), 0);
  close(getScrollProgress(0, 4140, 900), 1 / 3.6);
  assert.equal(getScrollProgress(-2340, 4140, 900), 1);
  assert.equal(getScrollProgress(10000, 4140, 900), 0);
  assert.equal(getScrollProgress(-10000, 4140, 900), 1);
});

test("the two titles enter from outside, protect center copy, then exit", () => {
  const start = getOrbitCopy(0, 1440);
  close(start.offset, 1008);
  assert.equal(start.opacity, 0);
  assert.equal(start.shift, 28);
  const middle = getOrbitCopy(0.48, 1440);
  assert.equal(middle.offset, 126);
  assert.equal(middle.opacity, 1);
  assert.equal(middle.centerOpacity, 1);
  assert.equal(getOrbitCopy(1, 1440).opacity, 0);
  assert.equal(getOrbitCopy(1, 1440).centerOpacity, 0);
});

test("all cards start hidden and settle into the original 852px three-column grid", () => {
  const viewport = { width: 1440, height: 900 };
  const width = (852 - 2 * 16) / 3;
  for (let i = 0; i < 5; i++) {
    assert.equal(getOrbitCard(i, 5, 0, viewport).opacity, 0);
    const card = getOrbitCard(i, 5, 1, viewport);
    close(card.width, width * 2);
    close(card.height, width / 1.33 * 2);
    assert.equal(card.opacity, 1);
    assert.equal(card.zIndex, 100 + i);
    const [x, y, z, rotateY, rotateZ, scale] = transformValues(card);
    close(x, -852 / 2 + (i % 3) * (width + 16) - width / 2);
    const gridHeight = 2 * width / 1.33 + 16;
    close(y, 900 * 0.02 - gridHeight / 2 + Math.floor(i / 3) * (width / 1.33 + 16) - width / 1.33 / 2);
    close(z, 0);
    close(rotateY, 0);
    close(rotateZ, 0);
    close(scale, 0.5);
  }
});

test("orbit geometry stays finite, bounded and reversible across supported sizes", () => {
  for (const viewport of [{ width: 800, height: 600 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
    for (let frame = 0; frame <= 100; frame++) {
      for (let i = 0; i < 5; i++) {
        const card = getOrbitCard(i, 5, frame / 100, viewport);
        assert.ok(card.opacity >= 0 && card.opacity <= 1);
        assert.ok(card.width > 0 && card.height > 0);
        const values = transformValues(card);
        assert.equal(values.length, 6);
        assert.ok(values.every(Number.isFinite));
        assert.ok(Math.abs(values[2]) <= 520);
        assert.ok(Math.abs(values[3]) <= 62);
        assert.ok(Math.abs(values[4]) <= 8);
        // No accumulated transforms: scrolling back to a progress value
        // deterministically produces exactly the same scene.
        assert.deepEqual(card, getOrbitCard(i, 5, frame / 100, viewport));
      }
    }
  }
});
