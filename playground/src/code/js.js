const js = `export default function App() {
  const [disabled, setDisabled] = React.useState(false);

  return (
    <div>
      <button
        onClick={() => setDisabled(!disabled)}
        className="btn"
        x-class={{
          'disabled-btn': disabled
        }}>
        <span x-if={disabled}>Disabled</span>
        <span x-else>Available</span>
      </button>
    </div>
  )
};
`;

export default js;
