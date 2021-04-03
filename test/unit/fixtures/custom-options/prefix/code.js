const a = <div>
  <p v-if={testA}>Aa</p>
  <p v-else-if={testAb}>Ab</p>
  <p v-else>Ac</p>
</div>;

const b = <div v-show={testB}>B</div>;

const c = <div v-for={item in list}>{item}</div>;
