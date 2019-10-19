const A = () => {
  const [[data], setData] = useState(0)
  return <input x-model-hook={data}/>
}
