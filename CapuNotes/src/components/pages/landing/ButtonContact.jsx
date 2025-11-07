
const ButtonContact = ({ handler, title ,children, className}) => {
    return (
        <button className={className}
        title={title}
        style={{padding: '1rem', background: 'transparent', border: 'none'}}
        onClick={() => {
           handler();
        }}>
            {children}
        </button>
    );
}     

export default ButtonContact;