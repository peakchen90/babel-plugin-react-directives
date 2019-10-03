const a = <div>
  <p v-if={testA}>Aa</p>
  <p v-else-if={testAb}>Ab</p>
  <p v-else>Ac</p>
</div>;

const b = <div v-show={testB}>B</div>;

class C {
  render() {
    return <input v-model={this.state.testC}/>
  }
}
