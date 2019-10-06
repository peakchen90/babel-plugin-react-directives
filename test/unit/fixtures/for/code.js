const a = (
  <div x-for={(item, index) in list} key={item}>
    <p>{item}</p>
    <p>{index}</p>
  </div>
)
