const a = <div>
  <p rd-if={testA}>A</p>
  <p rd-else-if={testB}>B</p>
  <p rd-else-if={testC}>C</p>
  Tail
</div>;

const b = <div>
  <p rd-if={testA}>A</p>
  <p rd-else-if={testB}>B</p>
  <p rd-else-if={testC}>C</p>
  <p rd-else>D</p>
</div>;
