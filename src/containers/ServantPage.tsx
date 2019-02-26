import { connect } from 'react-redux'
import { addServants } from '../actions/Servant'
import { State } from '../reducers'
import { getServants } from '../selectors/Servant'
import ServantPage from '../components/servants/ServantPage'
import Servant from '../models/Servant'
import { Dispatch } from 'redux';

const mapStateToProps = (state: State) => ({
  servants: getServants(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addServants: (servants: Servant[]) => dispatch(addServants(servants))
})

interface IMapStateToProps {
  servants: Servant[]
}

interface IMapDispatchToProps {
  addServant: (servant: Servant) => void
}

export default connect(mapStateToProps, mapDispatchToProps)(ServantPage)