const schema = {
  _request_id: {
    type: String,
    index: true,
    unique: true
  },
  locations: {
    type: [String],
    index: true
  }
};

module.exports = schema;
