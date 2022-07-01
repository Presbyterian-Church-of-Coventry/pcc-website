exports.handler = async (event, context) => {
  let res = {
    statusCode: 200,
    body: JSON.stringify({ msg: 'Function working!', event, context }),
  }
  console.log(res)
  return res
}
