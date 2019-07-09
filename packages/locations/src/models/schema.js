const schema = {
  _request_id: {
    type: String,
    index: true,
    unique: true
  },
  name: {
    type: String,
    index: true,
    unique: true
  },
  display: {
    type: String
  },
  description: {
    type: String
  }
};

module.exports = schema;
