const A = () => {
  const [data, setData] = useState(0)
  return <input x-model-hook={data}/>
}

const B = () => {
  const data = useState(0)
  return <input x-model-hook={data[0]}/>
}
