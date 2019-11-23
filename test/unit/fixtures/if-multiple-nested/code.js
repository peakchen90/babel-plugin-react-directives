const a = <div>
  <div x-if={testA}>
    <p>other1</p>
    <div x-if={testAa}>
      <img x-if={testAa1} alt="image1"/>
      <img x-else-if={testAa2} alt="image2"/>
      <img x-else alt="image3"/>
    </div>
    <div x-else>
      <div>
        <p>
          <span x-if={testAb1}>testAb1</span>
          <span x-else-if={testAb2}>
            <img x-if={testAb21} alt="image3"/>
          </span>
          <span x-else>testAb3</span>
        </p>
      </div>
    </div>
    <p>other2</p>
  </div>
  <div x-else>
    <p>other3</p>
    <span x-if={testBa}>Ba</span>
    <span x-else-if={testBb}>Bb</span>
    <span x-else>Bc</span>
    <p>other4</p>
  </div>
  <p x-if={testC}>C</p>
</div>;
