const A = () => {
  const [data, setData] = useState(0)
  return <input x-model={data}/>
}

const B = () => {
  const data = useState(0)
  return <input x-model={data[0]}/>
}
