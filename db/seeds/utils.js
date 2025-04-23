const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRefObject = (array)=> {
  if(array.length === 0) return []
  const result = []
  array.forEach((item) => {
    result[item.title]=item.article_id;
  });
  return result;
}



