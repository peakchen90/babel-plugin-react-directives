const A = () => {
  const [data, setData] = useState(0)
  const { a: [b] } = data
  return <input x-model-hook={b}/>
}

const B = () => {
  const {
    0: data,
    1: setData
  } = useState(0)
  return <input x-model-hook={data}/>
}
