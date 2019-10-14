exports.formatDates = list => {
  if (list.length < 1) return [];
  const formatted = list.map(obj => {
    const newObj = { ...obj };
    newObj.created_at = new Date(newObj.created_at);
    return newObj;
  });
  return formatted;
};

exports.makeRefObj = (arr, objKey, keyVal) => {
  if (arr.length === 0) return {};
  const ref = {};
  arr.forEach(item => (ref[item[objKey]] = item[keyVal]));
  return ref;
};

exports.formatComments = (comments, articleRef) => {
  if (comments.length < 1) return [];
  const formatted = comments.map(obj => {
    const newObj = { ...obj };
    newObj["author"] = newObj.created_by;
    delete newObj.created_by;
    newObj["article_id"] = articleRef[newObj.belongs_to];
    delete newObj.belongs_to;
    newObj.created_at = new Date(newObj.created_at);
    return newObj;
  });
  return formatted;
};
