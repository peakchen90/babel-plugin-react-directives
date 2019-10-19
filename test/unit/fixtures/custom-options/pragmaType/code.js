const A = () => {
  const [data, setData] = Preact.useState(0)
  return <input x-model-hook={data}/>
}
