import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Locations {
    @PrimaryGeneratedColumn({ name: "ID" })
    private _ID!: number;
    @Column({ name: "num" })
    private _streetNumber!: number;
    @Column({ name: "street" })
    private _street!: string;
    @Column({ name: "unit", nullable: true })
    private _unit!: string;
    @Column({ name: "city" })
    private _city!: string;
    @Column({ name: "state" })
    private _state!: string;
    @Column({ name: "zipcode" })
    private _zipcode!: number;
    @Column("decimal", { precision: 10, scale: 6, name: "lat", nullable: true, default: null})
    private _lat!: number;
    @Column("decimal", {precision: 10, scale: 6, name: "long", nullable: true, default: null})
    private _long!: number;
    @Column({ name: "route", nullable: true })
    private _route!: number;
    
    public get route(): number {
        return this._route;
    }
    public set route(value: number) {
        this._route = value;
    }
    public get ID(): number {
        return this._ID;
    }
    public get number(): number {
        return this._streetNumber;
    }
    public get street(): string {
        return this._street;
    }
    public get unit(): string {
        return this._unit;
    }
    public get city(): string {
        return this._city;
    }
    public get state(): string {
        return this._state;
    }
    public get zipcode(): number {
        return this._zipcode;
    }
    public get lat(): number {
        return this._lat;
    }
    public get long(): number {
        return this._long;
    }
    public set long(value: number) {
        this._long = value;
    }
    public set lat(value: number) {
        this._lat = value;
    }
    public set ID(value: number) {
        this._ID = value;
    }
    public set streetNumber(value: number) {
        this._streetNumber = value;
    }
    public set street(value: string) {
        this._street = value;
    }
    public set unit(value: string) {
        this._unit = value;
    }
    public set city(value: string) {
        this._city = value;
    }
    public set state(value: string) {
        this._state = value;
    }
    public set zipcode(value: number) {
        this._zipcode = value;
    }
}