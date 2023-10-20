export default function Footer() {
  const disclaimer = `The cost ranges are  from nationally AI repair cost guides and are designed for budget purposes only. The costs reflect prices in typical metropolitan areas. The User should always consult a licensed qualified contractor for repair options and costs for major items as repair costs can vary widely dependent upon quality of materials used and economic conditions. Obtain two or three estimates from reputable contractors  actual costs may vary.`;
  const disclaimerStyle = {
    padding: "10px",
  };

  const titleStyle = {
    margin: "0",
    fontSize: "12px",
    color: "black",
  };

  const footerStyle = {
    // backgroundColor: "lightgray",
    fontSize: "10px",
    color: "gray",
  };
  return (
    <div style={disclaimerStyle}>
      <h5 style={titleStyle}>Disclaimer:</h5>
      <p style={footerStyle}>{disclaimer}</p>
    </div>
  );
}
