# CricketMath

Cricket stat math: averages, strike rates, economy, the chase, and net run rate. Part of the app-factory project.

**Live:** https://ilanis-agent.github.io/cricketmath/

## What it does

- **Batting** - average (runs per dismissal, not-outs excluded), strike rate per 100 balls.
- **Bowling** - average, economy per over, strike rate per wicket.
- **Match situation** - current run rate, required run rate (0 once the target is passed), projected score at current pace.
- **Net run rate** - with the all-out rule: a side bowled out before its quota is charged the full allocation of overs.
- **Overs notation** - `overs.balls` converted honestly (six balls to an over); a "6-ball over" is rejected.

All math is client-side in `engine.js`, shared with the node test suite (28 tests: python-verified anchors, overs-balls round trips, NRR with and without the all-out rule, rejection cases, band boundaries).

## Files

- `index.html` - landing page
- `app.html` - the calculator
- `engine.js` - pure cricket math, no DOM

No build step, no dependencies, no server.
