const a = !!testRoot && <div>A</div>;

const b = !!testRoot && <div>
  {testA ? <p>A</p> : <p>B</p>}
</div>;
