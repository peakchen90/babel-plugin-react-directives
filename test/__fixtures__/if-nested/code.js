const a = <div>
  <p rd-if={testA}>
    A
    <span rd-if={testAa}>
      Aa
      <img rd-if={testAa1} alt="image1"/>
      <img rd-else-if={testAa2} alt="image2"/>
      <img rd-else alt="image3"/>
    </span>
    <span rd-else>Ab</span>
  </p>
  <p rd-else>B</p>
  <p rd-if={testC}>C</p>
</div>;
