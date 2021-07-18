import React from 'react';
import {useDispatch, useSelector} from 'redux'
import {setAuthentication} from '../../Redux/actions'


function AuthenticationButton() {
   
    // const authentication = useSelector((state) => state.user.authenticated)

    const dispatch = useDispatch()

    const handleOnClick=()=>{
        dispatch(setAuthentication)
    }
    
    return (
        <div>
            <button onClick={()=>handleOnClick()}>
                Authenticated
            </button>
        </div>
    )
}

export default AuthenticationButton
