export default {
  set(property, ind) {
    this.property = ind;
  },
  get(property) {
    return this.property || null;
  },
};
