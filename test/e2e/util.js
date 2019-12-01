/**
 * 等待
 * @param ms
 * @return {Promise<unknown>}
 */
export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * 创建类Input Node节点对象
 * @param value
 */
export function createInputNode(value) {
  const node = {};
  node.target = {
    nodeName: 'INPUT',
    nodeType: 1,
    value
  };
  return node;
}
