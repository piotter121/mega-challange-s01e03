import test from 'node:test';
import assert from 'node:assert/strict';
import { causeOf, dayFirst, sameCause, uniqueById } from '../support-kb/src/lib/kb/causes.ts';
import { deskRef } from '../support-kb/src/lib/kb/desk-ref.ts';
import { analyze, groups, reports, tenantOf } from './analyze.mjs';

test('reconcile overlapping export pages without duplicate report IDs', () => {
  const data = analyze();
  assert.equal(data.rawRows, 427);
  assert.equal(data.distinctReports, 412);
  assert.equal(data.overlapRows, 15);
  assert.equal(new Set(groups.flatMap((g) => g.reports.map((r) => r.id))).size, 412);
  assert.equal(groups.reduce((sum, g) => sum + g.reports.length, 0), 412);
  assert.deepEqual(uniqueById([{ id: 'x', value: 1 }, { id: 'x', value: 2 }]), [{ id: 'x', value: 2 }]);
});

test('counts come from tenant/form/channel, not intake guesses', () => {
  assert.deepEqual(groups.map((g) => [g.cause, g.reports.length]), [['parser', 379], ['hint', 33]]);
  assert.equal(analyze().mismatchedIntakeTags.length, 38);
  assert.equal(analyze().oneDayMove.length, 5);
  assert.ok(analyze().oneDayMove.every((r) => r.classifierCause === 'parser'));
});

test('form/channel changes a cause even with an identical subject', () => {
  const tenant = tenantOf({ tenant: 'alder.physio' });
  assert.equal(causeOf({ channel: 'form' }, tenant), 'hint');
  assert.equal(causeOf({ channel: 'app' }, tenant), 'parser');
  assert.equal(sameCause({ channel: 'form' }, tenant, { channel: 'app' }, tenant), false);
});

test('unknown tenants and month-first locales are not guessed into a cause', () => {
  assert.equal(causeOf({ channel: 'email' }, undefined), null);
  assert.equal(sameCause({ channel: 'email' }, undefined, { channel: 'email' }, undefined), false);
  assert.equal(dayFirst('en-US'), false);
  assert.equal(causeOf({ channel: 'form' }, { locale: 'en-US', form: 'booking-v3' }), null);
});

test('reception and filing are different timelines', () => {
  assert.equal(analyze().receivedBeforeJuly, 179);
  assert.equal(analyze().mergedOnJuly2, 184);
  assert.equal(reports.map((r) => r.receivedAt.slice(0, 10)).sort().at(-1), '2026-10-04');
});

test('desk reference is derived deterministically from the signature', () => {
  assert.equal(deskRef('author'), deskRef(' author '));
  assert.match(deskRef('author'), /^DR-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/);
  assert.notEqual(deskRef('author'), deskRef('another author'));
});
