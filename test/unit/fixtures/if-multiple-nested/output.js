const a = (
  <div>
    {testA ? (
      <p>
        A
        {testAa ? (
          <span>
            Aa
            {testAa1 ? (
              <img alt="image1"/>
            ) : testAa2 ? (
              <img alt="image2"/>
            ) : (
              <img alt="image3"/>
            )}
          </span>
        ) : (
          <span>Ab</span>
        )}
      </p>
    ) : (
      <p>B</p>
    )}

    {testC ? <p>C</p> : null}
  </div>
);
