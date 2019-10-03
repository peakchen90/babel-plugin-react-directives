const a = <div>
  <p x-if={testA}>A</p>
  <p x-else-if={testB}>B</p>
  <p x-else-if={testC}>C</p>
  Tail
</div>;

const b = <div>
  <p x-if={testA}>A</p>
  <p x-else-if={testB}>B</p>
  <p x-else-if={testC}>C</p>
  <p x-else>D</p>
</div>;
