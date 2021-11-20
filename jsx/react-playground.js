
class ButtonLike extends React.Component{
    constructor(props){
        super(props);
        this.state = {liked: false};
    }

    render(){
        if (this.state.liked){
            return 'You liked this';
        }

        const btn = (
            <React.Fragment>
                <button onClick={() => this.setState({liked: true})}>
                    {"Like"}
                </button>
            </React.Fragment>
            );

        return btn;
    }
}

const react_playground = document.querySelector("#react-playground");
ReactDOM.render(<ButtonLike />, 
                react_playground, 
                ()=>{
                    console.log("Rendered component:")
                    console.log(<ButtonLike />)
                });