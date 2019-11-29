const a = list.map(item =>
  item.name === "foo" ? <div key={item.id}>{item.name}</div> : null
);
