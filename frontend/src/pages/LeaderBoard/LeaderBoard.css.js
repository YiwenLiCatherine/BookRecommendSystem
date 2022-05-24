import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles({
    icon: {
        width:"60px",
        height:"60px",
        position:"relative",
        marginLeft:"350px",
        marginTop:"100px",
    },

    title: {
        textAlign: "center",
        color: "Black",
    },

    LeaderBoardTitle: {
        marginTop:"-10px",
        background:'linear-gradient(20deg , #d5edea 30%, #9f9dcc 90%)',
        color: "black",
    },

    tablehead: {
        textAlign: "center",
        color: "black",
        fontSize: "25px",
        marginLeft: "60px",
        padding: "80px",
    },

    tablebody: {
        textAlign: "center",
        color: 'black',
        paddingLeft: "100px",
        borderSpacing: "30px",
    },

    th: {
        color: "black",
        paddingLeft: "200px",
        fontSize: "25px",
    },

    td :{
        paddingLeft: "200px",
        fontSize: "20px",
        textAlign: "center",
    },

    bg : {
        background:'linear-gradient(20deg , #d5edea 30%, #9f9dcc 90%)',
    }
});