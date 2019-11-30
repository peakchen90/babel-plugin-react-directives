const a = (
  <div x-for={item in list} key={item.id}>
    <p x-for={i in item} key={i}>{i}</p>
  </div>
)
