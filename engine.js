/* CricketMath engine - cricket stat math: averages, strike rates, economy, required rate, net run rate.
   Pure math, no DOM. Shared by app.html and the node test suite. */
(function (root) {
  'use strict';

  function safe(n) { return (typeof n === 'number' && isFinite(n)) ? n : null; }

  // Cricket writes overs as overs.balls: 4.3 is four overs and three balls, not 4.3 decimal.
  // Six balls to an over.
  function ballsFromOvers(overs, balls) {
    if (!(overs >= 0) || !(balls >= 0)) return null;
    if (balls > 5) return null; // an over has 6 balls
    return overs * 6 + balls;
  }
  function oversFromBalls(balls) {
    if (!(balls >= 0)) return null;
    return Math.floor(balls / 6) + (balls % 6) / 10; // cricket notation
  }

  // Batting: dismissed twice in three not-out knocks? Not-outs do not count against you.
  function battingAverage(runs, dismissals) {
    return dismissals > 0 ? safe(runs / dismissals) : null;
  }
  function battingStrikeRate(runs, balls) {
    return balls > 0 ? safe(100 * runs / balls) : null;
  }

  // Bowling.
  function bowlingAverage(runsConceded, wickets) {
    return wickets > 0 ? safe(runsConceded / wickets) : null;
  }
  function economyRate(runsConceded, ballsBowled) {
    return ballsBowled > 0 ? safe(6 * runsConceded / ballsBowled) : null;
  }
  function bowlingStrikeRate(ballsBowled, wickets) {
    return wickets > 0 ? safe(ballsBowled / wickets) : null;
  }

  // Match situation.
  function currentRunRate(runs, balls) {
    return balls > 0 ? safe(6 * runs / balls) : null;
  }
  function requiredRunRate(target, score, ballsRemaining) {
    var needed = target - score;
    if (needed <= 0) return 0; // already won
    return ballsRemaining > 0 ? safe(6 * needed / ballsRemaining) : null;
  }
  function projectedScore(score, crr, ballsRemaining) {
    if (crr === null || !(ballsRemaining >= 0)) return null;
    return safe(score + crr * ballsRemaining / 6);
  }

  // Net run rate. The all-out honesty rule: a side bowled out early is charged
  // its full over quota, not the overs it actually survived.
  function netRunRate(runsFor, ballsFaced, runsAgainst, ballsBowled, opts) {
    opts = opts || {};
    var forBalls = opts.allOutFor && opts.quotaBallsFor ? opts.quotaBallsFor : ballsFaced;
    var againstBalls = opts.allOutAgainst && opts.quotaBallsAgainst ? opts.quotaBallsAgainst : ballsBowled;
    if (!(forBalls > 0) || !(againstBalls > 0)) return null;
    return safe(6 * runsFor / forBalls - 6 * runsAgainst / againstBalls);
  }

  // Honest bands.
  function economyBandT20(econ) {
    if (!(econ >= 0)) return null;
    if (econ < 6.0) return 'suffocating - the batter is playing your game';
    if (econ < 7.0) return 'excellent T20 bowling';
    if (econ < 8.5) return 'holding your own';
    if (econ < 10.0) return 'expensive - the batters found you';
    return 'demolished - bowl anywhere but there';
  }
  function strikeRateBand(sr) {
    if (!(sr >= 0)) return null;
    if (sr < 70) return 'anchor or stuck - the scoreboard decides which';
    if (sr < 100) return 'accumulator - build around this';
    if (sr < 130) return 'positive cricket - the innings moves';
    if (sr < 160) return 'attacking - fielders jogging back';
    return 'mayhem - T20 highlight-reel pace';
  }

  function fmt2(x) { return x === null || !isFinite(x) ? '-' : x.toFixed(2); }

  var api = {
    ballsFromOvers: ballsFromOvers,
    oversFromBalls: oversFromBalls,
    battingAverage: battingAverage,
    battingStrikeRate: battingStrikeRate,
    bowlingAverage: bowlingAverage,
    economyRate: economyRate,
    bowlingStrikeRate: bowlingStrikeRate,
    currentRunRate: currentRunRate,
    requiredRunRate: requiredRunRate,
    projectedScore: projectedScore,
    netRunRate: netRunRate,
    economyBandT20: economyBandT20,
    strikeRateBand: strikeRateBand,
    fmt2: fmt2
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.CricketMath = api;
})(typeof window !== 'undefined' ? window : globalThis);
