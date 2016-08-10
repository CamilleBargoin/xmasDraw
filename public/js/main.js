var Draw = require("./components/Draw.js");


var HeaderComponent = React.createClass({
  render: function() {
    return (
      <div className="HeaderComponent">
        <h1>Pige de Noël</h1>
        <p>blabla blabla blabla</p>
      </div>
    );
  }
});


var Main = React.createClass({
	render: function() {
		return (
			<div className="container">
				<HeaderComponent />
				<Draw />
			</div>
		);
	}
});

ReactDOM.render(
  <Main />,
  document.getElementById('content')
);