//=======================================================================================================================================================================================================================================================
import {deleteAsync} from "del";
import path from "../config/path.js";
//=======================================================================================================================================================================================================================================================
/** Очистить ненужные файлы */
const clearCompiledFiles = () => deleteAsync(path.clean);
//=======================================================================================================================================================================================================================================================
export default clearCompiledFiles;
//=======================================================================================================================================================================================================================================================