/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';

@Object()
export class Asset {
    @Property()
    public docType?: string;

    @Property()
    public VIN: string;

    @Property()
    public Make: string;

    @Property()
    public Model: string;

    @Property()
    public Year: number;

    @Property()
    public Owner: string;

    @Property()
    public Location?: string;

    @Property()
    public Weather?: number | null;

    @Property()
    public Coordinates?: {
      latitude: number,
      longitude: number
    };

    @Property()
    public AppraisedValue: number;
}
