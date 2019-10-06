const a = (
  <div x-if={item.name === 'foo'} x-for={item in list} key={item.id}>
    {item.name}
  </div>
)
