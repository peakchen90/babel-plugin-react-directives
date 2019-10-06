const a = list.map(item => (
  <div key={item.id}>
    {item.map(i => (
      <p key={i}>{i}</p>
    ))}
  </div>
));
