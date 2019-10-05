const A = () => {
  const [data, setData] = useState(0)
  const { a: [b] } = data
  return <input x-model={b}/>
}

const B = () => {
  const [data, setData] = useState([])
  return <input x-model={data[2]}/>
}
