export interface IGoogleAuthTokenResponse {
    userId: string;
    email: string;
    name: string;
    profile: string;
    success: boolean;
}

export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export interface LocationInfo {
    ip: string;
    city: string;
    region: string;
    country: string;
    loc: string; // This could represent latitude and longitude as a string
    org: string;
    postal: string;
    timezone: string;
}

export interface Bookmark {
    url: string;
    icon: string | null;
    checksum: string;
    datetime: Date;
    title: string;
}

export interface CheckoutSession {
    id: string;
    object: string;
    api_version: string;
    created: number;
    data: {
        object: {
            id: string;
            object: string;
            after_expiration: null | any;
            allow_promotion_codes: null | any;
            amount_subtotal: number;
            amount_total: number;
            automatic_tax: {
                enabled: boolean;
                liability: null | any;
                status: null | any;
            };
            billing_address_collection: null | any;
            cancel_url: string;
            client_reference_id: null | any;
            client_secret: null | any;
            consent: null | any;
            consent_collection: null | any;
            created: number;
            currency: string;
            currency_conversion: null | any;
            custom_fields: any[];
            custom_text: {
                after_submit: null | any;
                shipping_address: null | any;
                submit: null | any;
                terms_of_service_acceptance: null | any;
            };
            customer: string;
            customer_creation: string;
            customer_details: {
                address: {
                    city: string;
                    country: string;
                    line1: string;
                    line2: null | any;
                    postal_code: null | any;
                    state: null | any;
                };
                email: string;
                name: string;
                phone: null | any;
                tax_exempt: string;
                tax_ids: any[];
            };
            customer_email: null | any;
            expires_at: number;
            invoice: string;
            invoice_creation: null | any;
            livemode: boolean;
            locale: null | any;
            metadata: {
                email: string;
            };
            mode: string;
            payment_intent: null | any;
            payment_link: null | any;
            payment_method_collection: string;
            payment_method_configuration_details: null | any;
            payment_method_options: any;
            payment_method_types: string[];
            payment_status: string;
            phone_number_collection: {
                enabled: boolean;
            };
            recovered_from: null | any;
            setup_intent: null | any;
            shipping_address_collection: null | any;
            shipping_cost: null | any;
            shipping_details: null | any;
            shipping_options: any[];
            status: string;
            submit_type: null | any;
            subscription: string;
            success_url: string;
            total_details: {
                amount_discount: number;
                amount_shipping: number;
                amount_tax: number;
            };
            ui_mode: string;
            url: null | any;
        };
    };
    livemode: boolean;
    pending_webhooks: number;
    request: {
        id: null | any;
        idempotency_key: null | any;
    };
    type: string;
}

export interface SubscriptionEvent {
    id: string;
    object: string;
    api_version: string;
    created: number;
    data: {
        object: {
            id: string;
            object: string;
            application: null | any;
            application_fee_percent: null | any;
            automatic_tax: {
                enabled: boolean;
                liability: null | any;
            };
            billing_cycle_anchor: number;
            billing_cycle_anchor_config: null | any;
            billing_thresholds: null | any;
            cancel_at: null | any;
            cancel_at_period_end: boolean;
            canceled_at: number;
            cancellation_details: {
                comment: null | any;
                feedback: null | any;
                reason: string;
            };
            collection_method: string;
            created: number;
            currency: string;
            current_period_end: number;
            current_period_start: number;
            customer: string;
            days_until_due: null | any;
            default_payment_method: string;
            default_source: null | any;
            default_tax_rates: any[];
            description: null | any;
            discount: null | any;
            ended_at: number;
            invoice_settings: {
                account_tax_ids: null | any;
                issuer: {
                    type: string;
                };
            };
            items: {
                object: string;
                data: {
                    id: string;
                    object: string;
                    billing_thresholds: null | any;
                    created: number;
                    metadata: Record<string, any>;
                    plan: {
                        id: string;
                        object: string;
                        active: boolean;
                        aggregate_usage: null | any;
                        amount: number;
                        amount_decimal: string;
                        billing_scheme: string;
                        created: number;
                        currency: string;
                        interval: string;
                        interval_count: number;
                        livemode: boolean;
                        metadata: Record<string, string>;
                        nickname: string;
                        product: string;
                        tiers_mode: null | any;
                        transform_usage: null | any;
                        trial_period_days: null | any;
                        usage_type: string;
                    };
                    price: {
                        id: string;
                        object: string;
                        active: boolean;
                        billing_scheme: string;
                        created: number;
                        currency: string;
                        custom_unit_amount: null | any;
                        livemode: boolean;
                        lookup_key: null | any;
                        metadata: Record<string, string>;
                        nickname: string;
                        product: string;
                        recurring: {
                            aggregate_usage: null | any;
                            interval: string;
                            interval_count: number;
                            trial_period_days: null | any;
                            usage_type: string;
                        };
                        tax_behavior: string;
                        tiers_mode: null | any;
                        transform_quantity: null | any;
                        type: string;
                        unit_amount: number;
                        unit_amount_decimal: string;
                    };
                    quantity: number;
                    subscription: string;
                    tax_rates: any[];
                }[];
                has_more: boolean;
                total_count: number;
                url: string;
            };
            latest_invoice: string;
            livemode: boolean;
            metadata: Record<string, any>;
            next_pending_invoice_item_invoice: null | any;
            on_behalf_of: null | any;
            pause_collection: null | any;
            payment_settings: {
                payment_method_options: {
                    acss_debit: null | any;
                    bancontact: null | any;
                    card: {
                        network: null | any;
                        request_three_d_secure: string;
                    };
                    customer_balance: null | any;
                    konbini: null | any;
                    us_bank_account: null | any;
                };
                payment_method_types: null | any;
                save_default_payment_method: string;
            };
            pending_invoice_item_interval: null | any;
            pending_setup_intent: null | any;
            pending_update: null | any;
            plan: {
                id: string;
                object: string;
                active: boolean;
                aggregate_usage: null | any;
                amount: number;
                amount_decimal: string;
                billing_scheme: string;
                created: number;
                currency: string;
                interval: string;
                interval_count: number;
                livemode: boolean;
                metadata: Record<string, string>;
                nickname: string;
                product: string;
                tiers_mode: null | any;
                transform_usage: null | any;
                trial_period_days: null | any;
                usage_type: string;
            };
            quantity: number;
            schedule: null | any;
            start_date: number;
            status: string;
            test_clock: null | any;
            transfer_data: null | any;
            trial_end: null | any;
            trial_settings: {
                end_behavior: {
                    missing_payment_method: string;
                };
            };
            trial_start: null | any;
        };
    };
    livemode: boolean;
    pending_webhooks: number;
    request: {
        id: string | null;
        idempotency_key: string | null;
    };
    type: string;
}
