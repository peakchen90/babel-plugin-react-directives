const a = (
  <div>
    {testA ? (
      <div>
        <p>other1</p>
        {testAa ? (
          <div>
            {testAa1 ? (
              <img alt="image1"/>
            ) : testAa2 ? (
              <img alt="image2"/>
            ) : (
              <img alt="image3"/>
            )}
          </div>
        ) : (
          <div>
            <div>
              <p>
                {testAb1 ? (
                  <span>testAb1</span>
                ) : testAb2 ? (
                  <span>{testAb21 ? <img alt="image3"/> : null}</span>
                ) : (
                  <span>testAb3</span>
                )}
              </p>
            </div>
          </div>
        )}

        <p>other2</p>
      </div>
    ) : (
      <div>
        <p>other3</p>
        {testBa ? <span>Ba</span> : testBb ? <span>Bb</span> : <span>Bc</span>}

        <p>other4</p>
      </div>
    )}

    {testC ? <p>C</p> : null}
  </div>
);
