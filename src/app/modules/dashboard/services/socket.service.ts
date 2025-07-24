import { Injectable } from '@angular/core';
import {
  AuthSession,
  createClient,
  RealtimeChannel,
  SupabaseClient,
} from '@supabase/supabase-js';
import { Observable, Subject } from 'rxjs';
import { Constant } from '../../../core/config/constant';
import { PayloadChannel, PayloadChannelData } from '../models/payload-channel';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private supabase: SupabaseClient<any, string, any>;
  private payloadSubject: Subject<any> = new Subject<any>();
  public broadcastChannel: RealtimeChannel;
  private broadcastChannelName = 'broadcastChannel';

  private broadcastEvent = 'interaction-99921';

  constructor() {
    this.supabase = createClient(Constant.SUPABASE.URL, Constant.SUPABASE.KEY);
    // this.signIn();
    this.broadcastChannel = this.supabase.channel(this.broadcastChannelName);
    this.broadcastChannel
      .on('broadcast', { event: this.broadcastEvent }, (payload: any) => {
        this.payloadSubject.next(payload);
      })
      .subscribe((res) => console.log(res));
  }

  _session: AuthSession | null = null;

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  get payload$(): Observable<any> {
    return this.payloadSubject.asObservable();
  }

  joinChannel(channelName: string = 'room') {
    return this.supabase.channel(channelName);
  }

  sendBroadcastChannel(payload: PayloadChannelData) {    
    this.broadcastChannel
      .send({
        type: 'broadcast',
        event: this.broadcastEvent,
        payload: payload,
      })
      .then();
  }

  removeBroadcastChannel() {
    this.supabase.removeChannel(this.broadcastChannel).then();
  }

  removeChannel(channel: RealtimeChannel) {
    return this.supabase.removeChannel(channel);
  }

  listenToChannel(channel: RealtimeChannel, event: string = 'anonymous') {
    channel
      .on('broadcast', { event }, (payload) => {
        this.payloadSubject.next(payload);
      })
      .subscribe();
  }

  listenToEventV2(
    channel: RealtimeChannel,
    event: string,
    callback: (payload: any) => void,
  ) {
    return channel.on('broadcast', { event: event }, (payload) => {
      callback(payload);
    });
  }

  sendEvent(
    channel: RealtimeChannel,
    event: string = 'anonymous',
    payload: PayloadChannelData | PayloadChannel,
  ) {
    channel
      .send({
        type: 'broadcast',
        event: event,
        payload: payload,
      })
      .then();
  }

  joinSelfChannel(channelName: string = 'room') {
    return this.supabase.channel(channelName, {
      config: {
        broadcast: { self: true },
      },
    });
  }

  // Subscribe to the Channel

  signIn() {
    return this.supabase.auth.signInWithPassword({
      email: 'diep@email.com',
      password: 'Abc@123',
    });
  }
}
