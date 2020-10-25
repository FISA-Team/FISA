import { fakeFisaDoc } from './fakeFisaDoc';
import { FisaProjectI } from '../../../redux/interfaces';

export const fisaProject: () => FisaProjectI = () => ({
  connectedFrostServer: undefined,
  fisaDocument: fakeFisaDoc(),
  name: 'Mein Projekt',
  fisaObjects: [
    {
      frostId: undefined,
      id: 1,
      definitionName: 'Raum',
      attributes: [
        { definitionName: 'Name', value: 'Küche' },
        {
          definitionName: 'Beschreibung',
          value: 'Die Küche, in der alles gekocht wird',
        },
      ],
      children: [2, 3],
    },
    {
      frostId: undefined,
      id: 2,
      definitionName: 'Datenstrom',
      attributes: [
        { definitionName: 'Name', value: 'Temperatur in der Küche' },
        {
          definitionName: 'Beschreibung',
          value: 'Die Temperatur in der Küche',
        },
        {
          definitionName: 'Beobachtungstyp',
          value:
            'http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement',
        },
      ],
      children: [5, 6],
    },
    {
      frostId: undefined,
      id: 3,
      definitionName: 'Ort',
      attributes: [
        { definitionName: 'Name', value: 'Erdgeschoss' },
        { definitionName: 'Beschreibung', value: 'Neben dem Wohnzimmer' },
        { definitionName: 'Längengrad', value: '38.0038' },
        { definitionName: 'Breitengrad', value: '7.0034353' },
      ],
      children: [],
    },
    {
      frostId: undefined,
      id: 5,
      definitionName: 'Sensor',
      attributes: [
        { definitionName: 'Name', value: 'Temperatursensor' },
        {
          definitionName: 'Beschreibung',
          value: 'Temperatur in der Küche Sensor',
        },
        {
          definitionName: 'Metadaten',
          value:
            'https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf',
        },
      ],
      children: [],
    },
    {
      frostId: undefined,
      id: 6,
      definitionName: 'Sensortyp',
      attributes: [
        { definitionName: 'Name', value: 'Temperatur' },
        {
          definitionName: 'Beschreibung',
          value: 'Die Temperatur in der Küche',
        },
        {
          definitionName: 'Definition',
          value:
            'http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html#ThermodynamicTemperature',
        },
      ],
      children: [],
    },
  ],
  generateExampleData: false,
});
