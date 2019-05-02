import { Instrument } from 'MyModels';
import { createAsyncAction } from 'typesafe-actions';

export const loadInstrumentsAsync = createAsyncAction(
  'LOAD_INSTRUMENTS_REQUEST',
  'LOAD_INSTRUMENTS_SUCCESS',
  'LOAD_INSTRUMENTS_FAILURE',
//  'LOAD_INSTRUMENTS_CANCEL',
)<undefined, Instrument[], string/*, string*/>();

export const createInstrumentAsync = createAsyncAction(
  'CREATE_INSTRUMENT_REQUEST',
  'CREATE_INSTRUMENT_SUCCESS',
  'CREATE_INSTRUMENT_FAILURE',
  'CREATE_INSTRUMENT_CANCEL'
)<Instrument, Instrument[], string, string>();

export const updateInstrumentAsync = createAsyncAction(
  'UPDATE_INSTRUMENT_REQUEST',
  'UPDATE_INSTRUMENT_SUCCESS',
  'UPDATE_INSTRUMENT_FAILURE',
  'UPDATE_INSTRUMENT_CANCEL'
)<Instrument, Instrument[], string, string>();

export const deleteInstrumentAsync = createAsyncAction(
  'DELETE_INSTRUMENT_REQUEST',
  'DELETE_INSTRUMENT_SUCCESS',
  'DELETE_INSTRUMENT_FAILURE',
  'DELETE_INSTRUMENT_CANCEL'
)<Instrument, Instrument[], Instrument, string>();
