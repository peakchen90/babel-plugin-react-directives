const A = () => {
  const [data, setData] = useState(0)
  const { a: [b] } = data
  return <input x-model-hook={b}/>
}

const B = () => {
  const [data, setData] = useState([])
  return <input x-model-hook={data[2]}/>
}
