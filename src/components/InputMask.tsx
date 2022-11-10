import { InputProps, Input } from '@vkontakte/vkui';
import { AnyMaskedOptions, MaskElement } from 'imask';
import React, { ComponentType } from 'react'
import { IMaskMixin } from 'react-imask';
import { IMaskInputProps } from 'react-imask/dist/mixin';

type IMaskProps = IMaskInputProps<
    AnyMaskedOptions,
    false,
    string,
    MaskElement | HTMLTextAreaElement | HTMLInputElement
>;

export const InputMask: ComponentType<IMaskProps & InputProps> = IMaskMixin(({ inputRef, ...props }) => (
    <Input getRef={inputRef} {...props} />
));
