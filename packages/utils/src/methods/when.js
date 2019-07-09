export default (cond, f) => x => (cond(x) ? f(x) : x);
