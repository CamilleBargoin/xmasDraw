var DrawComponent = require("./components/DrawComponent.js");


var HeaderComponent = React.createClass({
  render: function() {
    return (
      <div className="HeaderComponent">
        <h1>Pige de Noël</h1>
        <p>Cette petite application permet de créer des piges et d&#39;y ajouter des participants.<br/>
        Il est ensuite possible de lancer le tirage automatique. Les résultats seront automatiquement affichés.
        </p>
      </div>
    );
  }
});


var Main = React.createClass({
	render: function() {
		return (
			<div className="container">
				<HeaderComponent />
				<DrawComponent />
			</div>
		);
	}
});

ReactDOM.render(
  <Main />,
  document.getElementById('content')
);