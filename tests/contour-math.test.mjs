import assert from "node:assert/strict";
import { test } from "node:test";
import {
  clampIndex,
  CONTOUR,
  humpHalfWidth,
  PEAK_Y,
  ribbonPath,
  stationCenter,
  stationWidth,
  stemPath,
  stepIndex,
  trackWidthFor,
} from "../src/components/experience/contour-math.ts";
import { experiences } from "../src/lib/experiences.ts";

const close = (actual, expected, tolerance = 1e-8) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

test("keeps the five companies, roles and dates in order", () => {
  assert.deepEqual(
    experiences.map(({ company, role, years }) => [company, role, years]),
    [
      ["SB Web Technology", "Content Writer", "2018–2020"],
      ["KPO & Company", "Content Manager", "2020–2022"],
      ["Daraz [Alibaba Group]", "Content Lead/Digital Marketing", "2023–2024"],
      ["Himalayan Dream Treks [Remote]", "SEO Content Manager", "2023–2024"],
      ["AFC Urgent Care [Remote]", "Growth Marketing Manager", "2024–2026"],
    ],
  );
});

test("every company carries a short station label and its responsibilities", () => {
  for (const experience of experiences) {
    assert.ok(experience.shortName.length > 0 && experience.shortName.length <= 18, experience.shortName);
    assert.ok(experience.responsibilities.length >= 3, experience.company);
    for (const line of experience.responsibilities) assert.ok(line.trim().length > 0);
  }
});

test("uses the geometry of the saved render, not invented numbers", () => {
  assert.equal(CONTOUR.baselineY, 92); // reference flat run: y = 90 (see contour-math.ts)
  assert.equal(CONTOUR.humpHeight, 62); // reference peak: 90 − 62 = 28
  assert.equal(CONTOUR.humpHalfWidth, 145); // reference: 532 − 387
  assert.equal(CONTOUR.controlOuter, 60.9); // reference: 532 − 471.1
  assert.equal(CONTOUR.controlInner, 69.6); // reference: 532 − 462.4
  assert.equal(CONTOUR.lineWidth, 1.5);
  assert.equal(CONTOUR.echoWidth, 0.825);
  assert.deepEqual([...CONTOUR.echoOpacity], [0.7, 0.62]);
  assert.equal(CONTOUR.echoOffsetY, 4);
  assert.equal(CONTOUR.echoPeakOffsetY, 1.6);
  assert.equal(CONTOUR.markerRadius, 13);
  assert.equal(CONTOUR.markerDotRadius, 5);
  assert.equal(CONTOUR.cellInset, 7);
  assert.equal(CONTOUR.activeScale, 1.16);
  assert.equal(CONTOUR.activeShiftY, 3);
  assert.equal(PEAK_Y, CONTOUR.baselineY - CONTOUR.humpHeight);
});

test("the third station of a 1064px track reproduces the reference path exactly", () => {
  /*
    From timeline.html, with the SVG shifted so the ribbon sits above the cards:
      M 0 90 H 387 C 471.1 90, 462.4 28, 532 28 C 601.6 28, 592.9 90, 677 90 H 1064
    Every x, every control offset and both echo shapes are the reference's.
  */
  assert.equal(
    ribbonPath(532, 1064),
    "M 0 92 H 387 C 471.1 92, 462.4 30, 532 30 C 601.6 30, 592.9 92, 677 92 H 1064",
  );
  assert.equal(
    ribbonPath(532, 1064, { echo: 1 }),
    "M 0 96 H 387 C 471.1 96, 462.4 31.6, 532 31.6 C 601.6 31.6, 592.9 96, 677 96 H 1064",
  );
  assert.equal(
    ribbonPath(532, 1064, { echo: 2 }),
    "M 0 100 H 387 C 471.1 100, 462.4 33.2, 532 33.2 C 601.6 33.2, 592.9 100, 677 100 H 1064",
  );
});

test("station cells match the reference: centre of the cell, 7px inset", () => {
  // Reference: 5 cells of 212.8px, stations at 7px / 198.8px wide.
  const count = 5;
  const track = 1064;
  close(stationCenter(0, count, track), 106.4);
  close(stationCenter(1, count, track), 319.2);
  close(stationCenter(2, count, track), 532);
  close(stationCenter(3, count, track), 744.8);
  close(stationCenter(4, count, track), 957.6);
  close(stationWidth(count, track), 198.8);
});

test("the arch narrows instead of running past the end of the rail", () => {
  const track = 1064;
  assert.equal(humpHalfWidth(532, track), 145);
  close(humpHalfWidth(stationCenter(0, 5, track), track), 106.4 - CONTOUR.edgePadding, 1e-9);
  close(humpHalfWidth(stationCenter(4, 5, track), track), 106.4 - CONTOUR.edgePadding, 1e-9);
  // The arch keeps its height and stays inside the track.
  const first = ribbonPath(stationCenter(0, 5, track), track);
  // A 12px flat run, then the arch: nothing is drawn at a negative x.
  assert.ok(first.startsWith("M 0 92 H 12 C "), first);
  assert.ok(!/ -\d/.test(first), first);
});

test("the stem runs from the arch peak to the card edge", () => {
  assert.equal(stemPath(532), "M 532 30 V 140");
  assert.equal(CONTOUR.stripHeight, 140);
  // The marker has room above the peak, and the dots sit on the flat run.
  assert.ok(PEAK_Y - CONTOUR.markerRadius >= 0, PEAK_Y);
  assert.equal(CONTOUR.baselineY - CONTOUR.dotLift, 80);
  assert.ok(CONTOUR.baselineY - CONTOUR.dotLift + CONTOUR.dotSize / 2 < CONTOUR.baselineY);
});

test("track width keeps cards readable, then lets the rail scroll", () => {
  assert.equal(trackWidthFor(1136, 5), 1136);
  assert.equal(trackWidthFor(320, 5), 190 * 5);
});

test("index helpers clamp and wrap for keyboard and scroll input", () => {
  assert.equal(clampIndex(-3, 5), 0);
  assert.equal(clampIndex(9, 5), 4);
  assert.equal(stepIndex(4, 5, 1), 0);
  assert.equal(stepIndex(0, 5, -1), 4);
  assert.equal(clampIndex(2, 0), 0);
});
