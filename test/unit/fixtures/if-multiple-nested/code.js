const a = <div>
  <p x-if={testA}>
    A
    <span x-if={testAa}>
      Aa
      <img x-if={testAa1} alt="image1"/>
      <img x-else-if={testAa2} alt="image2"/>
      <img x-else alt="image3"/>
    </span>
    <span x-else>Ab</span>
  </p>
  <p x-else>B</p>
  <p x-if={testC}>C</p>
</div>;
