import _ from 'lodash';

export default ({ platform, version = '' }) => { // eslint-disable-line
  const regex = /\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)/ig;
  const versionString = _.get(version.match(regex), '[0]', '');
  if (_.isEmpty(versionString)) return -1;
  const versionNumber = _.toNumber(versionString.split('.').join('').split('^(-|_|part1,part2)$')[0]);
  return versionNumber;
};
