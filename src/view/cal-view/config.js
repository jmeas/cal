export default {
  // How far back and forward we go on the timeline
  // based on the scale
  timelineOffsets: {
    days: {
      forward: 180,
      back: 180
    },
    weeks: {
      forward: 52,
      back: 52
    }
  },

  // Whether we start out in `days` mode or `weeks` mode
  defaultScale: 'days',

  // Some cached dimensions. We could read these from the CSS, but
  // they're unlikely to change all that frequently, and
  // this is substantially simpler.
  yAxisCellHeight: 35,
  xAxisCellWidth: 140,
};
